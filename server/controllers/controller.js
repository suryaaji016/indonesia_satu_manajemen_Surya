const { comparePassword } = require("../helpers/bcrypt");
const {
  Admin,
  Application,
  Group,
  Item,
  ApplicationAnswer,
  ApplicationScore,
} = require("../models");
const { signToken } = require("../helpers/jwt");

class Controller {
  static async register(req, res) {
    try {
      let user = await Admin.create(req.body);
      res.status(201).json({
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
  static async login(req, res) {
    try {
      let { email, password } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }
      let user = await Admin.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: "Invalid email/password" });
      }
      let isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email/password" });
      }
      let access_token = signToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
  static async addApplication(req, res) {
    req.body.UserId = req.user.id;

    try {
      let data = await Application.create(req.body);
      console.log("🚀 ~ Controller ~ addApplication ~ data:", data);
      res.status(201).json(data);
    } catch (error) {
      console.log("Error addApplication:", error);
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
  static async viewApplications(req, res) {
    let user = req.user;
    try {
      let applications = await Application.findAll({
        where: { UserId: user.id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: ApplicationScore,
            as: "ApplicationScore",
            attributes: ["total_score", "status"],
            required: false,
          },
        ],
      });
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
  static async getApplicationById(req, res) {
    try {
      const application = await Application.findByPk(req.params.id, {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: ApplicationScore,
            as: "ApplicationScore",
            attributes: ["total_score", "status", "createdAt"],
            required: false,
          },
        ],
      });
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.status(200).json(application);
    } catch (error) {
      console.log("Error getApplicationById:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
  static async updateApplication(req, res) {
    try {
      const application = await Application.findByPk(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      await application.update(req.body);
      res.status(200).json(application);
    } catch (error) {
      console.log("Error updateApplication:", error);
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
  static async deleteApplication(req, res) {
    try {
      await Application.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
      console.log("Error deleteApplication:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getGroupsWithItems(req, res) {
    try {
      const groups = await Group.findAll({
        include: [
          {
            model: Item,
            as: "Items",
          },
        ],
        order: [
          ["id", "ASC"],
          [{ model: Item, as: "Items" }, "id", "ASC"],
        ],
      });
      res.status(200).json(groups);
    } catch (error) {
      console.log("Error getGroupsWithItems:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async submitScoring(req, res) {
    try {
      const { applicationId, answers } = req.body;

      const application = await Application.findOne({
        where: {
          id: applicationId,
          UserId: req.user.id,
        },
      });

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const existingScore = await ApplicationScore.findOne({
        where: { applicationId },
      });

      await ApplicationAnswer.destroy({
        where: { applicationId },
      });

      const answerPromises = answers.map((answer) =>
        ApplicationAnswer.create({
          applicationId,
          itemId: answer.itemId,
        })
      );
      await Promise.all(answerPromises);

      const groups = await Group.findAll({
        include: [
          {
            model: Item,
            as: "Items",
          },
        ],
      });

      let totalScore = 0;

      for (const group of groups) {
        let groupScore = 0;
        for (const item of group.Items) {
          const answer = answers.find((a) => a.itemId === item.id);
          if (answer) {
            const itemScore = item.bobot_f * item.bobot_d;
            groupScore += itemScore;
          }
        }
        const weightedGroupScore = groupScore * group.bobot_b;
        totalScore += weightedGroupScore;
      }

      let status;
      if (totalScore <= 55) {
        status = "HIGH RISK";
      } else if (totalScore > 55 && totalScore <= 70) {
        status = "MEDIUM RISK";
      } else {
        status = "LOW RISK";
      }

      if (existingScore) {
        await existingScore.update({
          total_score: totalScore,
          status,
        });
      } else {
        await ApplicationScore.create({
          applicationId,
          total_score: totalScore,
          status,
        });
      }

      res.status(201).json({
        message: existingScore
          ? "Scoring berhasil diupdate"
          : "Scoring berhasil disimpan",
        score: {
          total_score: totalScore,
          status,
          risk_level: status,
        },
      });
    } catch (error) {
      console.log("Error submitScoring:", error);
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  static async getApplicationScore(req, res) {
    try {
      const { id } = req.params;

      const application = await Application.findOne({
        where: { id, UserId: req.user.id },
        include: [
          {
            model: ApplicationScore,
            as: "ApplicationScore",
          },
        ],
      });

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      if (!application.ApplicationScore) {
        return res.status(404).json({ message: "Score belum tersedia" });
      }

      const answers = await ApplicationAnswer.findAll({
        where: { applicationId: id },
        include: [
          {
            model: Item,
            as: "Item",
            include: [
              {
                model: Group,
                as: "Group",
              },
            ],
          },
        ],
      });

      res.status(200).json({
        application,
        score: application.ApplicationScore,
        details: answers,
      });
    } catch (error) {
      console.log("Error getApplicationScore:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
module.exports = Controller;
