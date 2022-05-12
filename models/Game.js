const { Schema, model } = require("mongoose");

const GameSchema = new Schema({
    FEN: { type: String, required: true },
    players: {
        white: { type: Schema.Types.ObjectId, ref: "User" },
        black: { type: Schema.Types.ObjectId, ref: "User" },
    },
});

module.exports = model("Game", GameSchema);
