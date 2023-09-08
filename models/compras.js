const { Schema, model } = require('mongoose');


const medicamentoSchema = Schema({
    fechaCompra: Date,
    proveedor : {nombre: String, contacto: String},
    medicamentosComprados: [{
    nombreMedicamento: String,
    cantidadComprada: Number,
    precioCompra: Number
    }],
})

module.exports = model('compras', medicamentoSchema);