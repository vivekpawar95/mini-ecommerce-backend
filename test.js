const bcrypt = require("bcrypt");

async function demo() {
  console.log(
    await bcrypt.compare(
      "testpass",
      "$2b$10$OGalOkumCMhMW5gOVm05deM5D4nKgqNO4Hvmsmo4EEIkStcZZcpF2"
    )
  );
}

demo().then();
