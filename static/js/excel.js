var workbook // to put it in outer scope and make it available for download

getLetter = n => { return String.fromCharCode(n + 64) }

transpose = array => { return array[0].map((_, colIndex) => array.map(row => row[colIndex])) }

// changes formula string to match excel notation (like pi -> PI())
convertFormula = formula => {
    // raplace param names to cell ranges
    w = []
    map.forEach((v, k) => { w.push(k) })
    par_rg = new RegExp(`(?<!u)(${w.join("|")})`, "g")
    formula = formula.replace(par_rg, prm => map.get(prm))

    // replace all special symbols
    sym_rg = new RegExp("pi|e", "g")
    formula = formula.replace(sym_rg, m => {
        return {
            "pi": "PI()",
            "e": "EXP(1)"
        }[m]
    })

    // insert '*' sign between all number-letter pars, as excel doesn't rocognize those as multiplication
    mul_rg = new RegExp("[0-9][a-z|A-Z]", "g")
    formula = formula.replace(mul_rg, m => m[0] + "*" + m[1])

    return formula
}


updateExcel = u_formula => {
    data = []
    map = new Map() // for formulae generation
    last_column = 1 // to determine which column is currently being populated

    // create matrice of params' names, values and uncertainty
    for (p of params) {
        // add map key/value
        l = getLetter(last_column)
        map.set(p.name, `${l}2:${l}6`)
        last_column++


        //  if param is a constant, fill the column with param's value and skip uncer column
        if (p.is_const) {
            column = [p.name, ...Array(5).fill(p.value)]
            data.push(column)
            continue
        }

        // add map uncertainty key/value
        l = getLetter(last_column)
        map.set(`u${p.name}`, `${l}2:${l}6`)
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

    worksheet = addFormulae(worksheet, last_column, u_formula)

    workbook.SheetNames.push("First")
    workbook.Sheets["First"] = worksheet

    // display Excel as html table
    table_wrapper.innerHTML = XLSX.utils.sheet_to_html(worksheet)
}

/// Adds formulae to worksheet based on formula
addFormulae = (ws, last_column, u_formula) => {
    l_f = getLetter(last_column) // formulae column letter
    l_u = getLetter(last_column + 1) // formulae uncertainty column letter

    // ============ | INSERT FORMULAE | ==============
    // ==== | ORIGINAL FORMULA | ====
    ws[`${l_f}2`] = {
        t: "n",
        v: math.evaluate(formula_in.value, scope).toFixed(4),
        F: `${l_f}2:${l_f}6`,
        f: convertFormula(formula_in.value) // convert formula given by user to match Excel notation
    }
    // ==== | UNCERTAINTY FORMULA | ====
    ws[`${l_u}2`] = {
        t: "n",
        v: math.evaluate(u_formula, scope).toFixed(4),
        F: `${l_u}2:${l_u}6`,
        f: convertFormula(u_formula) // convert uncertainty formula to match Excel notation
    }

    // populate the rest of the rows
    for (i = 3; i <= 6; i++) {
        incrementScope()

        // ==== | ORIGINAL FORMULA | ====
        ws[`${l_f}${i}`] = {
            t: "n",
            v: math.evaluate(formula_in.value, scope).toFixed(4),
            F: `${l_f}2:${l_f}6`
        }
        // ==== | UNCERTAINTY FORMULA | ====
        ws[`${l_u}${i}`] = {
            t: "n",
            v: math.evaluate(u_formula, scope).toFixed(4),
            F: `${l_u}2:${l_u}6`
        }
    }

    return ws
}


// to properly increment scope values
incrementScope = () => {
    for(p of params) { 
        if(p.is_const) continue     // if param is constant skip its incrementation

        scope.set(p.name, scope.get(p.name) + 1)
        scope.set(`u${p.name}`, scope.get(`u${p.name}`) + .1)
    }
}

downloadExcel = () => {
    XLSX.writeFile(workbook, "demo.xlsx")
}