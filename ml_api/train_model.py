#!/usr/bin/env python3
"""
train_model.py

Usage examples:
  python train_model.py                # generate synthetic data, train, save model.pkl
  python train_model.py --data data.csv --output model.pkl --seed 42

Outputs:
  - model.pkl          (joblib dump of sklearn Pipeline: preprocess + estimator)
  - metadata.json      (feature names, target name, crops list, training params)
  - training_report.txt (metrics and best params)
"""
import argparse
import json
import logging
import sys
from pathlib import Path
from typing import Optional

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.model_selection import RandomizedSearchCV, cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# -------------------------
# Config and logging
# -------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("train_model")


# -------------------------
# Synthetic data generator
# -------------------------
def generate_synthetic_dataset(
    n_samples: int = 2000,
    random_state: int = 42,
) -> pd.DataFrame:
    """
    Create a synthetic dataset with columns:
      - crop (categorical)
      - soil_type (categorical)
      - season (categorical)
      - rainfall_mm (numeric)
      - temperature_c (numeric)
      - demand_index (numeric 0..1)
      - price_per_kg (numeric target)
    """
    rng = np.random.default_rng(random_state)

    crops = ["Wheat", "Rice", "Maize", "Cotton", "Sugarcane"]
    soil_types = ["sandy", "loamy", "clay"]
    seasons = ["kharif", "rabi", "zaid"]

    rows = []
    for _ in range(n_samples):
        crop = rng.choice(crops)
        soil = rng.choice(soil_types)
        season = rng.choice(seasons)
        rainfall = abs(rng.normal(loc=600, scale=300))  # mm
        temp = rng.normal(loc=25, scale=6)  # C
        demand = rng.uniform(0.3, 1.0)

        # baseline price per crop
        base_price = {
            "Wheat": 22.0,
            "Rice": 28.0,
            "Maize": 20.0,
            "Cotton": 45.0,
            "Sugarcane": 15.0,
        }[crop]

        # a simple domain-informed formula to simulate price variations
        price = base_price
        # rainfall effect (too low or too high can reduce price for some crops)
        price *= 1 + (0.0005 * (rainfall - 500))
        # temperature effect
        price *= 1 + (0.003 * (25 - temp))
        # demand effect
        price *= 1 + 0.3 * (demand - 0.5)
        # soil & season small multipliers
        if soil == "loamy":
            price *= 1.02
        if season == "rabi" and crop == "Wheat":
            price *= 1.05

        # add noise
        price += rng.normal(scale=2.0)

        rows.append({
            "crop": crop,
            "soil_type": soil,
            "season": season,
            "rainfall_mm": float(round(rainfall, 2)),
            "temperature_c": float(round(temp, 2)),
            "demand_index": float(round(demand, 3)),
            "price_per_kg": float(round(max(price, 1.0), 2))
        })

    df = pd.DataFrame(rows)
    return df


# -------------------------
# Data loader & validator
# -------------------------
def load_dataset(path: Optional[Path]) -> pd.DataFrame:
    if path:
        logger.info(f"Loading dataset from: {path}")
        df = pd.read_csv(path)
        expected = {"crop", "soil_type", "season", "rainfall_mm", "temperature_c", "demand_index", "price_per_kg"}
        missing = expected - set(df.columns)
        if missing:
            raise ValueError(f"Input CSV is missing required columns: {missing}")
        return df
    else:
        logger.info("No dataset provided — generating synthetic dataset.")
        return generate_synthetic_dataset()


# -------------------------
# Training function
# -------------------------
def train(
    df: pd.DataFrame,
    output_path: Path,
    random_state: int = 42,
    test_size: float = 0.2,
    cv_folds: int = 5,
    n_iter_search: int = 20,
    n_jobs: int = -1,
):
    logger.info("Preparing data...")
    target_col = "price_per_kg"
    X = df.drop(columns=[target_col])
    y = df[target_col].astype(float)

    # Feature groups
    categorical_features = ["crop", "soil_type", "season"]
    numeric_features = ["rainfall_mm", "temperature_c", "demand_index"]

    # Preprocessing pipeline
    numeric_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])
    categorical_transformer = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="constant", fill_value="missing")),
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])
    preprocessor = ColumnTransformer(transformers=[
        ("num", numeric_transformer, numeric_features),
        ("cat", categorical_transformer, categorical_features),
    ], remainder="drop")

    # Estimator
    estimator = RandomForestRegressor(random_state=random_state, n_jobs=n_jobs)

    # Full pipeline
    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("estimator", estimator)
    ])

    # Train/test split
    logger.info("Splitting train/test...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)

    # Hyperparameter search (Randomized)
    param_dist = {
        "estimator__n_estimators": [100, 200, 400],
        "estimator__max_depth": [None, 8, 16, 32],
        "estimator__min_samples_split": [2, 5, 10],
        "estimator__min_samples_leaf": [1, 2, 4],
    }
    logger.info("Starting hyperparameter search (RandomizedSearchCV)...")
    search = RandomizedSearchCV(
        pipeline,
        param_distributions=param_dist,
        n_iter=n_iter_search,
        scoring="neg_root_mean_squared_error",
        cv=cv_folds,
        random_state=random_state,
        n_jobs=n_jobs,
        verbose=1
    )
    search.fit(X_train, y_train)

    best_pipeline = search.best_estimator_
    logger.info(f"Best params: {search.best_params_}")
    logger.info("Evaluating on test set...")

    # Cross-validated score on train (for reference)
    cv_scores = cross_val_score(best_pipeline, X_train, y_train, cv=cv_folds, scoring="neg_root_mean_squared_error", n_jobs=n_jobs)
    cv_rmse = -cv_scores.mean()

    # Test metrics
    preds = best_pipeline.predict(X_test)
    mse = mean_squared_error(y_test, preds)
    rmse = float(mse ** 0.5)          # backward-compatible RMSE
    mae = mean_absolute_error(y_test, preds)
    r2 = r2_score(y_test, preds)

    logger.info(f"Test RMSE: {rmse:.4f} | MAE: {mae:.4f} | R2: {r2:.4f}")

    # Save pipeline (preprocessor + model) as single artifact
    model_file = output_path / "model.pkl"
    joblib.dump(best_pipeline, model_file)
    logger.info(f"Saved model pipeline to: {model_file}")

    # Save metadata
    metadata = {
        "target": target_col,
        "numeric_features": numeric_features,
        "categorical_features": categorical_features,
        "n_samples": int(df.shape[0]),
        "random_state": int(random_state),
        "cv_rmse": float(cv_rmse),
        "test_rmse": float(rmse),
        "test_mae": float(mae),
        "test_r2": float(r2),
        "best_params": search.best_params_,
    }
    metadata_file = output_path / "metadata.json"
    with open(metadata_file, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    logger.info(f"Saved metadata to: {metadata_file}")

    # Save a human-readable training report
    report_file = output_path / "training_report.txt"
    with open(report_file, "w", encoding="utf-8") as f:
        f.write("Training report\n")
        f.write("================\n\n")
        f.write(f"Number of samples: {df.shape[0]}\n")
        f.write(f"Train/test split: {1-test_size:.2f}/{test_size:.2f}\n\n")
        f.write(f"CV RMSE (train): {cv_rmse:.4f}\n")
        f.write(f"Test RMSE: {rmse:.4f}\n")
        f.write(f"Test MAE: {mae:.4f}\n")
        f.write(f"Test R2: {r2:.4f}\n\n")
        f.write("Best params:\n")
        json.dump(search.best_params_, f, indent=2)
    logger.info(f"Saved training report to: {report_file}")

    # Save a small sample of test predictions
    sample_file = output_path / "sample_predictions.csv"
    sample_df = X_test.copy()
    sample_df["y_true"] = y_test
    sample_df["y_pred"] = preds
    sample_df.to_csv(sample_file, index=False)
    logger.info(f"Saved sample predictions to: {sample_file}")

    return {
        "model_file": str(model_file),
        "metadata_file": str(metadata_file),
        "report_file": str(report_file),
        "sample_file": str(sample_file),
        "metrics": metadata
    }


# -------------------------
# CLI
# -------------------------
def parse_args():
    p = argparse.ArgumentParser(description="Train crop price prediction model")
    p.add_argument("--data", type=str, default=None, help="Path to CSV dataset (optional). If omitted, synthetic data is generated.")
    p.add_argument("--output", type=str, default=".", help="Output directory to save model and artifacts")
    p.add_argument("--seed", type=int, default=42, help="Random seed")
    p.add_argument("--test-size", type=float, default=0.2, help="Test set fraction")
    p.add_argument("--cv-folds", type=int, default=5, help="Cross-validation folds")
    p.add_argument("--n-iter", type=int, default=20, help="RandomizedSearch iterations")
    p.add_argument("--n-jobs", type=int, default=-1, help="n_jobs for training (-1 uses all cores)")
    return p.parse_args()


def main():
    args = parse_args()
    out_dir = Path(args.output)
    out_dir.mkdir(parents=True, exist_ok=True)

    # load data
    df = load_dataset(Path(args.data) if args.data else None)

    result = train(
        df,
        output_path=out_dir,
        random_state=args.seed,
        test_size=args.test_size,
        cv_folds=args.cv_folds,
        n_iter_search=args.n_iter,
        n_jobs=args.n_jobs,
    )

    logger.info("Training complete. Artifacts:")
    logger.info(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
