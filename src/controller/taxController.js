const bcrypt = require("bcrypt");
const db = require("../db/db.js");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
// User API

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );


    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Insert user
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );


    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {

  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user
    const [rows] = await db.query(
      "SELECT id, name, email, password FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    // Compare password
    // const isMatch = await bcrypt.compare(password, user.password);

    // if (!isMatch) {
    //   return res.status(401).json({ message: "Invalid email or password" });
    // }

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.contactUs = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  try {

    const { firstName, lastName, email, query } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      replyTo: email,
      to: "samshashank1995@gmail.com",
      subject: "New Query from Tax Tool",
      html: `
        <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
  <tr>
    <td align="center">

      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e5e7eb;">

        <!-- Header -->
        <tr>
          <td style="background:#16a34a; color:#ffffff; padding:16px 24px; font-size:20px; font-weight:bold;">
            New Contact Query
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:24px; color:#333; font-size:14px;">

            <p style="margin-bottom:20px;">
              A new query has been submitted through the website contact form.
            </p>

            <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">

              <tr style="background:#f9fafb;">
                <td style="font-weight:bold; width:140px;">Name</td>
                <td>${firstName} ${lastName}</td>
              </tr>

              <tr>
                <td style="font-weight:bold;">Email</td>
                <td>${email}</td>
              </tr>

              <tr style="background:#f9fafb;">
                <td style="font-weight:bold; vertical-align:top;">Query</td>
                <td>${query}</td>
              </tr>

            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f3f4f6; padding:16px 24px; font-size:12px; color:#6b7280;">
            This message was sent from the contact form on your website.
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Query sent successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to send email"
    });
  }
}


// CESS API

exports.addCess = async (req, res) => {
  try {
    const { name, amount, percentage } = req.body;

    if (!amount || !percentage) {
      return res.status(400).json({ message: "Amount and percentage required" });
    }

    await db.query(
      "INSERT INTO cess (name, amount, percentage) VALUES (?, ?, ?)",
      [name, amount, percentage]
    );

    res.status(201).json({ message: "Cess added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllCess = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cess ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCess = async (req, res) => {
  try {
    const { id, name, amount, percentage } = req.body;

    const [result] = await db.query(
      "UPDATE cess SET name=?, amount=?, percentage=? WHERE id=?",
      [name, amount, percentage, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cess not found" });
    }

    res.json({ message: "Cess updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCess = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM cess WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cess not found" });
    }

    res.json({ message: "Cess deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Surcharge API

exports.addSurcharge = async (req, res) => {
  try {
    const { name, amount, percentage } = req.body;

    if (!amount || !percentage) {
      return res.status(400).json({ message: "Amount and percentage required" });
    }

    await db.query(
      "INSERT INTO surcharge (name, amount, percentage) VALUES (?, ?, ?)",
      [name, amount, percentage]
    );

    res.status(201).json({ message: "Surcharge added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllSurcharge = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM surcharge ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateSurcharge = async (req, res) => {
  try {
    const { id, name, amount, percentage } = req.body;

    const [result] = await db.query(
      "UPDATE surcharge SET name=?, amount=?, percentage=? WHERE id=?",
      [name, amount, percentage, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Surcharge not found" });
    }

    res.json({ message: "Surcharge updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteSurcharge = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM surcharge WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Surcharge not found" });
    }

    res.json({ message: "Surcharge deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// New Regime API

exports.addIncomeTax = async (req, res) => {
  try {
    const { amount, percentage } = req.body;

    if (!amount || !percentage) {
      return res.status(400).json({ message: "Amount and percentage required" });
    }

    await db.query(
      "INSERT INTO income_tax (amount, percentage) VALUES (?, ?)",
      [amount, percentage]
    );

    res.status(201).json({ message: "Income tax added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAllIncomeTax = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM income_tax ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateIncomeTax = async (req, res) => {
  try {
    const { id, amount, percentage } = req.body;

    const [result] = await db.query(
      "UPDATE income_tax SET amount=?, percentage=? WHERE id=?",
      [amount, percentage, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Income tax not found" });
    }

    res.json({ message: "Income tax updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteIncomeTax = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM income_tax WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Income tax not found" });
    }

    res.json({ message: "Income tax deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Old Regime API

exports.addOldIncomeTax = async (req, res) => {
  try {
    const { amount, percentage } = req.body;

    if (!amount || !percentage) {
      return res.status(400).json({ message: "Amount and percentage required" });
    }

    await db.query(
      "INSERT INTO old_income_tax (amount, percentage) VALUES (?, ?)",
      [amount, percentage]
    );

    res.status(201).json({ message: "Old income tax added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllOldIncomeTax = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM old_income_tax ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateOldIncomeTax = async (req, res) => {
  try {
    const { id, amount, percentage } = req.body;

    const [result] = await db.query(
      "UPDATE old_income_tax SET amount=?, percentage=? WHERE id=?",
      [amount, percentage, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Old income tax not found" });
    }

    res.json({ message: "Old income tax updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteOldIncomeTax = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM old_income_tax WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Old income tax not found" });
    }

    res.json({ message: "Old income tax deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Rebate API

exports.addRebate = async (req, res) => {
  try {
    const { name, amount, upto } = req.body;

    if (!name || !amount || !upto) {
      return res.status(400).json({ message: "Name, amount and upto are required" });
    }

    await db.query(
      "INSERT INTO rebate (name, amount, upto) VALUES (?, ?, ?)",
      [name, amount, upto]
    );

    res.status(201).json({ message: "Rebate added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllRebates = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM rebate ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateRebate = async (req, res) => {
  try {
    const { id, name, amount, upto } = req.body;

    const [result] = await db.query(
      "UPDATE rebate SET name=?, amount=?, upto=? WHERE id=?",
      [name, amount, upto, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rebate not found" });
    }

    res.json({ message: "Rebate updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteRebate = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM rebate WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rebate not found" });
    }

    res.json({ message: "Rebate deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Old Rebate API Pending

exports.addOldRebate = async (req, res) => {
  try {
    const { name, amount, upto } = req.body;

    if (!name || !amount || !upto) {
      return res.status(400).json({ message: "Name, amount and upto are required" });
    }

    await db.query(
      "INSERT INTO old_rebate (name, amount, upto) VALUES (?, ?, ?)",
      [name, amount, upto]
    );

    res.status(201).json({ message: "Rebate added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllOldRebates = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM old_rebate ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateOldRebate = async (req, res) => {
  try {
    const { id, name, amount, upto } = req.body;

    const [result] = await db.query(
      "UPDATE old_rebate SET name=?, amount=?, upto=? WHERE id=?",
      [name, amount, upto, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rebate not found" });
    }

    res.json({ message: "Rebate updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteOldRebate = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM old_rebate WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rebate not found" });
    }

    res.json({ message: "Rebate deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Latest Update API
exports.addLatestUpdate = async (req, res) => {
  try {
    const { name, type, description } = req.body;

    if (!name || !type || !description) {
      return res.status(400).json({ message: "Name, type and description required" });
    }

    // Check if name already exists
    const [exists] = await db.query(
      "SELECT id FROM latest_updates WHERE name = ?",
      [name]
    );

    if (exists.length > 0) {
      return res.status(409).json({ message: "Name already exists" });
    }

    await db.query(
      "INSERT INTO latest_updates (name, type, description) VALUES (?, ?, ?)",
      [name, type, description]
    );

    res.status(201).json({ message: "Latest Update added successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllLatestUpdates = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM latest_updates ORDER BY id ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTop10LatestUpdates = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM latest_updates ORDER BY id ASC LIMIT 10"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLatestUpdateById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM latest_updates WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Update not found" });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateLatestUpdate = async (req, res) => {
  try {
    const { id, name, type, description } = req.body;

    if (!id || !name || !type || !description) {
      return res.status(400).json({ message: "Id, name, type and description required" });
    }

    // Check duplicate name for other records
    const [exists] = await db.query(
      "SELECT id FROM latest_updates WHERE name = ? AND id != ?",
      [name, id]
    );

    if (exists.length > 0) {
      return res.status(409).json({ message: "Name already exists" });
    }

    const [result] = await db.query(
      "UPDATE latest_updates SET name=?, type=?, description=? WHERE id=?",
      [name, type, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Update not found" });
    }

    res.json({ message: "Latest Update updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteLatestUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM latest_updates WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Update not found" });
    }

    res.json({ message: "Update deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Calculate Tax API

exports.calculateTax = async (req, res) => {
  try {
    const [cessList] = await db.query("SELECT * FROM cess ORDER BY id ASC");
    const [rebateList] = await db.query("SELECT * FROM rebate ORDER BY id ASC");
    const [oldRebateList] = await db.query("SELECT * FROM old_rebate ORDER BY id ASC");
    const [surchargeList] = await db.query("SELECT * FROM surcharge ORDER BY id ASC");

    const { currentIncome, oldRegimeIncome } = req.body;

    const { newRegimeTax, oldRegimeTax } = await generateTaxValue(currentIncome, oldRegimeIncome);

    // ---------- REBATE ----------
    let newTax = newRegimeTax;
    let oldTax = oldRegimeTax;

    const currentRebate = rebateList.find(r => currentIncome <= r.amount)?.upto;
    if (currentRebate) {
      newTax = Math.max(0, newTax - currentRebate);
    }

    const oldRebate = oldRebateList.find(r => oldRegimeIncome <= r.amount)?.upto;
    if (oldRebate) {
      oldTax = Math.max(0, oldTax - oldRebate);
    }

    // ---------- SURCHARGE ----------
    const calculateSurcharge = (tax, income) => {
      if (tax <= 0) return 0;
      const percent = (surchargeList.find(s => income > s.amount)?.percentage || 0) / 100;
      return tax * percent;
    };

    const newSurcharge = calculateSurcharge(newTax, currentIncome);
    const oldSurcharge = calculateSurcharge(oldTax, oldRegimeIncome);

    // ---------- CESS ----------
    const calculateCess = (tax, surcharge, income) => {
      if (tax <= 0) return 0;
      const percent = (cessList.find(c => income > c.amount)?.percentage || 0) / 100;
      return (tax + surcharge) * percent;
    };

    const newCess = calculateCess(newTax, newSurcharge, currentIncome);
    const oldCess = calculateCess(oldTax, oldSurcharge, oldRegimeIncome);

    // ---------- TOTAL TAX ----------
    const newTotalTax = newTax + newSurcharge + newCess;
    const oldTotalTax = oldTax + oldSurcharge + oldCess;

    res.status(200).json({
      newRegime: {
        tax: newTotalTax,
        baseTax: newTax,
        surcharge: newSurcharge,
        cess: newCess
      },
      oldRegime: {
        tax: oldTotalTax,
        baseTax: oldTax,
        surcharge: oldSurcharge,
        cess: oldCess
      }
    });

  } catch (err) {
    console.error("Error while calculating tax", err);
    res.status(500).json({ error: err });
  }
};

const generateTaxValue = async (totalIncome, oldRegimeIncome) => {

  const [incomeTaxList] = await db.query("SELECT * FROM income_tax ORDER BY id ASC");
  const [oldSlabIncomeTaxList] = await db.query("SELECT * FROM old_income_tax ORDER BY id ASC");

  const newRegimeTax = calculateTaxFromSlabs(totalIncome, incomeTaxList);
  const oldRegimeTax = calculateTaxFromSlabs(oldRegimeIncome, oldSlabIncomeTaxList);

  return {
    newRegimeTax,
    oldRegimeTax
  };
};

const calculateTaxFromSlabs = (totalIncome, slabList) => {
  let income = totalIncome;
  let tax = 0;
  let previousAmount = 0;

  for (const slab of slabList) {
    if (income <= 0) break;

    const slabRange = slab.amount - previousAmount;
    const taxableIncome = Math.min(income, slabRange);

    tax += taxableIncome * (slab.percentage / 100);

    income -= taxableIncome;
    previousAmount = slab.amount;
  }

  return tax;
};

