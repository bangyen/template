.PHONY: init fmt lint type test all dashboard

init: ## install tooling
	python -m pip install -U pip
	pip install -e ".[dev]"
	pre-commit install

fmt:  ## format code
	black .

lint: ## lint code
	ruff check .

type: ## type-check
	mypy .

test: ## run tests
	python -m pytest

all: fmt lint type test

# Dashboard target
dashboard: ## start Flask dashboard
	@echo "Starting dashboard..."
	@echo "Dashboard will be available at http://localhost:5050"
	python3 dashboard/main.py
