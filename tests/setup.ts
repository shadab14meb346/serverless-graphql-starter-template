import { getHash } from "../common/bcrypt";
import { PostGrace, Table } from "../core/db-connection";

export default async function setup() {
  console.log("insert records");
  const insertIntoUsers = async () => {
    const adminUser = {
      email: "admin@test.com",
      name: "admin",
      password: "12345",
      admin: true,
    };
    const hashedPassword = await getHash(adminUser.password);
    await Promise.all([
      PostGrace.DB()
        .insert([
          {
            id: 5,
            email: "totallynewuser@gmail.com",
            name: "Shadab",
            encrypted_password:
              "$2b$11$R0C3cyBJfV0Vt1ZuTt4s6.QOqjCjQWr5.SmMXjgI7739RaF0CoHTa",
            //password for this user is 12345
          },
          {
            email: adminUser.email,
            name: adminUser.name,
            admin: adminUser.admin,
            encrypted_password: hashedPassword,
          },
          {
            id: 999,
            email: "userid999@gmail.com",
            name: "userid999",
            encrypted_password:
              "$2b$11$R0C3cyBJfV0Vt1ZuTt4s6.QOqjCjQWr5.SmMXjgI7739RaF0CoHTa",
            //password for this user is 12345
          },
        ])
        .into(Table.USERS),
    ]);
  };
  await Promise.all([insertIntoUsers()]);
}
