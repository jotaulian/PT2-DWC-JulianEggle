$(document).ready(function () {
    let cuerpoTabla = $('#cuerpo-tabla');
    let producto = $('#producto');
    let cantidad = $('#cantidad');
    let precioUnitario = $('#precio-unitario');
    let descuento = $('#descuento');
    let totalLinea = $('#total-linea');

    let baseImponible = $('#base-imponible');
    let iva = $('#iva');
    let total = $('#total');

    let totalBI = 0;

    /* Introducir cantidad: */
    cantidad.on('blur', function(){
        if(precioUnitario.val() > 0){
            let resultado = calcularPrecio(cantidad.val(), precioUnitario.val());
            totalLinea.val(resultado);
        }
    })
    // Introducir precio unitario: */
    precioUnitario.on('blur', function(){
        if(cantidad.val() > 0){
            let resultado = calcularPrecio(cantidad.val(), precioUnitario.val());
            totalLinea.val(resultado);
        }
    })
    // Introducir descuento: */
    descuento.on('blur', function(){
        if(cantidad.val()&&precioUnitario.val()){
            let resultado = calcularPrecioDescuento(cantidad.val(), precioUnitario.val(), descuento.val());
            totalLinea.val(resultado);
        }
    })

    
    /* AGREGAR FILA */
    $("#agregarLinea").on('click', function(event){
        event.preventDefault();
        if(producto.val()&&cantidad.val()&&precioUnitario.val()){
            let id = $.now();
            let row = `<tr data-id="${id}">;
                                <td>${producto.val()}</td>
                                <td class="q">${cantidad.val()}</td>
                                <td class="p">${precioUnitario.val()}</td>
                                <td class="descuento">${descuento.val()}</td>
                                <td class="total-linea">${totalLinea.val()}</td>
                                <td><a href="" id="borrar" class="btn btn-danger">Borrar</a></td>
                            </tr>`;
            cuerpoTabla.append(row);
            // Limpiamos inputs:
            $('tbody input').each(function(){
                $(this).val('');
            })

            //Actualizamos valores de la factura:
            actualizarTodo();
            
            //Imprimimos la fecha y hora
            imprimirFecha();
        }
    })


    /* BORRAR FILA */
    $(document).on("click", "#borrar", function(event) {
        event.preventDefault();
        $(this).parent().parent().remove();
        
        //Actualizamos valores de la factura:
        actualizarTodo();
    }) 


    /* APLICAR DESCUENTO A TODO: */
    $("#aplicarDescuento").on('click', function(e){
        e.preventDefault();
        let valor = $('#descuento-lineas').val();

        // Modificamos el campo de descuento de cada fila:
        $(".descuento").each(function(){
                $(this).text(valor);
            });

        // Seleccionar todas las filas insertadas y modificar sus valores:
        $("tbody tr:gt(0)").each(function(){
                let q = $(this).children('.q').text();
                let p = $(this).children('.p').text();
                let d = $(this).children('.descuento').text();
                let nuevoTotal = calcularPrecioDescuento(q, p, d);
                $(this).children('.total-linea').text(nuevoTotal);
            });

        //Actualizamos valores de la factura:
        actualizarTodo();
    });


    /* Funciones para calcular precio total al introducir los valores en el input:*/
    function calcularPrecio(q, p){
        let resultado = (q*p);
        return resultado;
    }
    function calcularPrecioDescuento(q, p, d){
        let resultado = (q * p) - ((q * p)*(d/100))
        return resultado;
    }

    /* Funciones para actualizar los valores de la factura: */
    function actualizarTodo(){
        actualizarBI();
        actualizarIVA();
        actualizarTotalFactura();
    }
    function actualizarBI(){
        totalBI = 0;
        $("tbody tr:gt(0)").each(function(){
                    let tl = $(this).children('.total-linea').text();
                    totalBI += Number(tl);
                });
        baseImponible.text(totalBI);
    }
    function actualizarIVA(){
        let bi = baseImponible.text();
        let totalIVA = Math.round(Number(bi) * 0.21);
        iva.text(totalIVA);
    }
    function actualizarTotalFactura(){
        let resultado = Number(baseImponible.text()) + Number(iva.text());
        total.text(resultado);
    }


    /* Fecha y Hora */
    function imprimirFecha(){
        if($('.fecha')){
            $('.fecha').remove();
        }
        let d = new Date();
        let strDate = "Última fila agregada el " + d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " a las " + d.getHours() + ":" + d.getMinutes();
        
        $('.row').append(`<p class="fecha">${strDate}</p>`)
    }

});






