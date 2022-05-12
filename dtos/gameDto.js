module.exports = class GameDto {
    FEN;
    id;

    constructor(model) {
        this.FEN = model.FEN;
        this.id = model._id;
    }
};
