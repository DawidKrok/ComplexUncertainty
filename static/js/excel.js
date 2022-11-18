getLetter = n => { return String.fromCharCode(n + 64) }

transpose = array => { return array[0].map((_, colIndex) => array.map(row => row[colIndex])) }



updateExcel = (params, formula, u_formula) => {
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

        // add uncertainty column
        column = [`u(${p.name})`, ...[...Array(5).keys()].map(x => (x * .1) + p.uncer)]
        data.push(column)
    }

    // to get the letter of column where data matrice ends
    last_column = data.length
    data.push(["y"], ["u(y)"])
    data = transpose(data)
    
    // generate XLSX workbook based on data
    workbook = XLSX.utils.book_new()
    worksheet = XLSX.utils.aoa_to_sheet(data)
    
    worksheet = addFormulae(worksheet, last_column)

    workbook.SheetNames.push("First")
    workbook.Sheets["First"] = worksheet

    // display Excel as html table
    table_wrapper.innerHTML = XLSX.utils.sheet_to_html(worksheet)
    
    return workbook
}

/// Adds formulae to worksheet based on formula
addFormulae = (ws, last_column) => {
    // TODO: create formulae based on formula and math.js string expression
    l_f = getLetter(last_column+1) // formulae column letter
    l_u = getLetter(last_column+2) // formulae uncertainty column letter

    ws[`${l_f}2`] = { t: "n", v: 4, F: `${l_f}2:${l_f}6`, f: "sin(A2:A6)*B2:B6" }
    ws[`${l_f}3`] = { t: "n", v: 4, F: `${l_f}2:${l_f}6` }
    ws[`${l_f}4`] = { t: "n", v: 4, F: `${l_f}2:${l_f}6` }
    ws[`${l_f}5`] = { t: "n", v: 4, F: `${l_f}2:${l_f}6` }
    ws[`${l_f}6`] = { t: "n", v: 4, F: `${l_f}2:${l_f}6` }

    return ws
}

downloadExcel = () => {
    wb = updateExcel(getParams())

    XLSX.writeFile(wb, "demo.xlsx")
}