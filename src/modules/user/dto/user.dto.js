const { z } = require("zod");

const authDto = z.object({
  email: z.string().email().nonempty(),
});

const verifyCodeDto = z.object({
  email: z.string().email().nonempty(),
  code: z.string().length(6),
});

const loginWithPasswordDto = z.object({
  email: z.string().email().nonempty(),
  password: z.string().min(6).nonempty(),
});

const updateProfileDto = z.object({
  lastName: z.string().min(1).optional(),
  firstName: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
  profilePath: z.string().optional(),
});

module.exports = {
  authDto,
  verifyCodeDto,
  loginWithPasswordDto,
  updateProfileDto,
};
