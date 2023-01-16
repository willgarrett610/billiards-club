import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

const { Generator } = require("snowflake-generator");

const bcrypt = require("bcrypt");

type Data = {
  success: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let request = JSON.parse(req.body);

  let firstName = request.firstName;
  let lastName = request.lastName;
  let email = request.email;
  let password = request.password;

  let hash = await bcrypt.hash(password, 10);

  let snowflakeGenerator = new Generator();
  let id = snowflakeGenerator.generate(1);
  await prisma.user.create({
    data: {
      id: id,
      first_name: firstName,
      last_name: lastName,
      email: email,
      pass_hash: hash,
    },
  });
  res.status(200).json({ success: true });
}
