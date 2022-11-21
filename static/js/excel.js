var workbook // to put it in outer scope and make it available for download

getLetter = n => { return String.fromCharCode(n + 64) }

transpose = array => { return array[0].map((_, colIndex) => array.map(row => row[colIndex])) }

// changes formula string to match excel notation (like pi -> PI())
convertFormula = formula => {
    // raplace param names to cell ranges
    w = []
    map.forEach((v, k) => { w.push(k) })
    par_rg = new RegExp(w.join("|"), "g")
    formula = formula.replace(par_rg, value => map.get(value) ) 

    // replace all special symbols
    sym_rg = new RegExp("pi", "g")    
    formula = formula.replace(sym_rg, m => {
        return {
            "pi": "PI()",
        }[m]
    })

    // insert '*' sign between all number-letter pars, as excel doesn't rocognize those as multiplication
    mul_rg = new RegExp("[0-9][a-z|A-Z]", "g")
    formula = formula.replace(mul_rg, m => m[0] + "*" + m[1])

    return formula
}


updateExcel = (formula, u_formula) => {
    data = []
    map = new Map() // for formulae generation
    last_column = 1 // to determine which column is currently being populated

    // create matrice of params' names, values and uncertainty
    for(p of params) {
        // add map key/value
        l = getLetter(last_column)
        map.set(p.name, `${l}2:${l}6`)
        last_column++


        //  if param is a constant, fill the column with param's value and skip uncer column
        if(p.is_const) {
            column = [p.name, ...Array(5).fill(p.value)]
            data.push(column)
            continue
        }

        // add map uncertainty key/value
        l = getLetter(last_column)
        map.set(`u(${p.name})`, `${l}2:${l}6`)
        last_column++

        // add value column
        column = [p.name, ...[...Array(5).keys()].map(x => x + p.value)]
        data.push(column)

        // add uncertainty column
        column = [`u(${p.name})`, ...[...Array(5).keys()].map(x => (x * .1) + p.uncer)]
        data.push(column)
    }

    // to get the letter of column where data matrice ends
    data.push(["y"], ["u(y)"])
    data = transpose(data)
    
    // generate XLSX workbook based on data
    workbook = XLSX.utils.book_new()
    worksheet = XLSX.utils.aoa_to_sheet(data)
    
    worksheet = addFormulae(worksheet, last_column, map)

    workbook.SheetNames.push("First")
    workbook.Sheets["First"] = worksheet

    // display Excel as html table
    table_wrapper.innerHTML = XLSX.utils.sheet_to_html(worksheet)
}

/// Adds formulae to worksheet based on formula
addFormulae = (ws, last_column, map) => {
    // TODO: create formulae based on formula and math.js string expression
    l_f = getLetter(last_column) // formulae column letter
    l_u = getLetter(last_column+1) // formulae uncertainty column letter

    // convert formula given by user to match Excel notation
    formula = convertFormula(formula_in.value)

    ex_scope = scope.valueOf() // to not override original scope

    // ============ | INSERT FORMULAE | ==============
    ws[`${l_f}2`] = { 
        t: "n", 
        v: math.evaluate(formula_in.value, scope), 
        F: `${l_f}2:${l_f}6`, 
        f: formula 
    }

    // populate the rest of the rows
    for(i = 3; i <= 6; i++) {
        scope.forEach( (v, k) => ex_scope.set(k, v+1))
        ws[`${l_f}${i}`] = { 
            t: "n", 
            v: math.evaluate(formula_in.value, ex_scope), 
            F: `${l_f}2:${l_f}6` 
        }
    }

    return ws
}

downloadExcel = () => {
    XLSX.writeFile(workbook, "demo.xlsx")
}