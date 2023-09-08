const { Schema, model } = require('mongoose');


const ventasSchema = Schema({
    fechaVenta: Date,
    paciente : {nombre: String, direccion: String},
    empleado : {nombre: String, cargo: String},
    medicamentosVendidos: [{nombreMedicamento: String,
    cantidadVendida: Number,
    precio: Number
}],
})

module.exports = model('ventas', ventasSchema);