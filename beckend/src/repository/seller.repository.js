import { AppDataSource } from "../config/data-sorce.js";
import { SellerEntity } from "../models/seller.models.js";

const getRepo = () => AppDataSource.getRepository(SellerEntity);

async function create(data) {
  const repo = getRepo();
  const seller = repo.create(data);
  return await repo.save(seller);
}

async function findByEmail(email) {
  const repo = getRepo();
  return await repo.findOne({ where: { email } });
}

async function findById(id) {
  const repo = getRepo();
  return await repo.findOne({ where: { id } });
}

async function findByShopname(shopname) {
  const repo = getRepo();
  return await repo.findOne({ where: { shopname } });
}

async function findAll({ page = 1, limit = 10, status } = {}) {
  const repo = getRepo();
  const [rows, total] = await repo.findAndCount({
    where: status ? { status } : {},
    order: { createdAt: "DESC" },
    skip: (page - 1) * limit,
    take: limit,
  });
  return { rows, total };
}

async function update(id, fields) {
  const repo = getRepo();
  await repo.update({ id }, fields);
  return await findById(id);
}

async function remove(id) {
  const repo = getRepo();
  const seller = await findById(id);
  if (!seller) return null;
  await repo.delete({ id });
  return seller;
}

export default {
  create,
  findByEmail,
  findById,
  findByShopname,
  findAll,
  update,
  remove,
};