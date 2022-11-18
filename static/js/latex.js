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

    filtered_params = params.filter(pa => !pa.is_const)
    // iterate through all non constant params
    for(p of filtered_params) {

        derivative = math.derivative(formula_in.value, p.name)

        // skip and remove all non-contributing params (the ones listed in params list, but not included in formula)
        if(derivative.toTex() == "0")  {
            filtered_params = filtered_params.filter(par => par.name != p.name)
            continue
        }

        // don't put '+' sign before the first part
        if(p.name != filtered_params[0].name) {
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

    // ========= | DISPLAY EXCEL | ========
    updateExcel(params, formula_in.value, "")
}

// Copy the LaTex inside of button 
copyLatex = () => { navigator.clipboard.writeText(tex_btn.value) }


