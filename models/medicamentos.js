const { Schema, model } = require('mongoose');


const medicamentoSchema = Schema({
    nombre: String,
    precio : Number,
    stock: Number,
    fechaExpiracion: Date,
    proveedor: Schema.Types.Mixed
})

module.exports = model('Medicamento', medicamentoSchema);