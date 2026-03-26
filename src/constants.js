const CORES_MAP = { '2-core': 2, '4-core': 4, '8-core': 8, '16-core': 16 };
const COMPUTE_PRICE = { '2-core': 0.18, '4-core': 0.36, '8-core': 0.72, '16-core': 1.44 };
const PLAN_LIMITS = { free: 120, pro: 180 };
const STORAGE_LIMIT = 20;
const STORAGE_PRICE = 0.07;
const PLAN_COST = 4;

module.exports = { CORES_MAP, COMPUTE_PRICE, PLAN_LIMITS, STORAGE_LIMIT, STORAGE_PRICE, PLAN_COST };
