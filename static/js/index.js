class Param {
    constructor(n, v, u, c=false) {
        this.name = n
        this.value = v
        this.uncer = u
        this.is_const = c
    }
}

/// TODO: check if formula contains parameters that aren't in scope
/// TODO: Use is_const flag to skip derivatives of constant terms

// ===== | GENERATE FORMULA | =====
updateLatex = () => {
    params = getParams() 

    // scope is for math.js' evaluate() - assigns values to variable names
    scope = new Map()
    for(p of params) { scope.set(p.name, p.value) }
    
    // ===== | GENERATE LATEX | =====
    general_latex = "u(y) = \\sqrt{"
    evaluated_latex = "\\sqrt{"
    whole_expr = 0  // to determine final value

    // iterate through all non constant params
    for(p of params.filter(pa => !pa.is_const)) {

        derivative = math.derivative(formula_in.value, p.name)

        // skip and remove all non-contributing params (the ones listed in params list, but not included in formula)
        if(derivative.toTex() == "0")  {
            params = params.filter(par => par.name != p.name)
            continue
        }

        // don't put '+' sign before the first part
        if(p.name != params[0].name) {
            general_latex += " + "
            evaluated_latex += " + "
        }  
        
        expr = derivative.compile()

        general_latex += `\\Big(\\big(  ${derivative.toTex()}  \\big)\\:  u(${p.name})  \\Big)^2`
        evaluated_latex += `\\big( ${expr.evaluate(scope).toFixed(4) } \\cdot ${p.uncer} \\big)^2`

        whole_expr += Math.pow(expr.evaluate(scope) * p.uncer, 2)
    }
    general_latex += "}"
    evaluated_latex += "}"
    

    // ========= | DISPLAY LATEX | ========
    latex =`${general_latex} = ${evaluated_latex} = ${ Math.sqrt(whole_expr).toFixed(4) }`

    tex_btn.value = latex // LaTeX is stored in this button's value so it could be copied by user
    tex.innerHTML = `\\[ ${ latex } \\]`

    // rerender LaTeX on page
    MathJax.typesetPromise()
}

// Copy the LaTex inside of button 
copyLatex = () => { navigator.clipboard.writeText(tex_btn.value) }



// ================== | PARAMS | =================


// Add Param Card
param_add.onclick = () => {
    node = $("<div class='param_card'></div>")
    node.append('<input type="text" class="param_name" onchange="updateLatex()">')
    node.append('<input type="number" class="param_value" value="1" onchange="updateLatex()">')
    node.append('<input type="number" class="param_uncer" value="0.1" onchange="updateLatex()">')    

    params_container.append(node[0])
}

// gets parameters' values from all Param Cards
getParams = () => {
    params = []
    
    $(".param_card").each((i, elem) => {
        n = $( elem ).find(".param_name").val()
        v = parseFloat( $( elem ).find(".param_value").val() )
        u = parseFloat( $( elem ).find(".param_uncer").val() )

        // add param only if all values are populated
        if(n != "" && v != "" && u != "") {  
            params.push(new Param(n, v, u))
        }
    })

    return params
}

transpose = (array) => {
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]))
}

// ================== | EXCEL | =================
generateExcel = (params) => {
    data = []

    // create matrice of params' names, values and uncertainty
    for(p of params) {
        //  if param is a constant, fill the column with param's value and skip uncer column
        if(p.is_const) {
            column = [p.name, ...Array(5).fill(p.value)]
            data.push(column)
            continue
        }

        // add value column
        column = [p.name, ...[...Array(5).keys()].map(x => x + p.value)]
        data.push(column)

        // add uncer column
        column = [`u(${p.name})`, ...[...Array(5).keys()].map(x => (x * .1) + p.uncer)]
        data.push(column)
    }

    // TODO: create formulae based on math.js string expression and add it to data
    // formulae = 
    
    data = transpose(data)

    // generate XLSX workbook based on data
    workbook = XLSX.utils.book_new()
    worksheet = XLSX.utils.aoa_to_sheet(data)

    workbook.SheetNames.push("First")
    workbook.Sheets["First"] = worksheet

    table_wrapper.innerHTML = XLSX.utils.sheet_to_html(worksheet)
    
    return workbook
}

generateExcel(getParams())

downloadExcel = () => {
    wb = generateExcel(getParams())

    // XLSX.writeFile(wb, "demo.xlsx")
}


updateLatex()