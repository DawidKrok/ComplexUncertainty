/* TODO: 
    -check if formula contains parameters that aren't in scope
    -Use is_const flag to skip derivatives of constant terms
*/

// ===== | GENERATE FORMULA | =====
updateLatex = () => {
    updateParams()

    // scope is for math.js' evaluate() - assigns values to variable names
    scope = new Map()
    for (p of params) {
        scope.set(p.name, p.value)
        if (!p.is_const) scope.set(`u${p.name}`, p.uncer)
    }

    // ===== | GENERATE UNCERTAINTY FORMULA | =====
    // base_latex = "" 
    general_latex = "u(y) = \\sqrt{"
    evaluated_latex = "\\sqrt{"
    u_formula = "(" // for final value and excel formulae

    filtered_params = params.filter(pa => !pa.is_const)
    // iterate through all non constant params
    for (p of filtered_params) {

        derivative = math.derivative(formula_in.value, p.name)
        // skip and remove all non-contributing params (the ones listed in params list, but not included in formula)
        if (derivative.toTex() == "0") {
            filtered_params = filtered_params.filter(par => par.name != p.name)
            continue
        }

        // don't put '+' sign before the first part
        if (p.name != filtered_params[0].name) {
            general_latex += " + "
            evaluated_latex += " + "
            u_formula += " + "
        }

        expr = derivative.compile()

        u_formula += `(${derivative.toString()}*u${p.name})^2`
        general_latex += `\\Big(\\big(  ${derivative.toTex()}  \\big)\\:  u(${p.name})  \\Big)^2`
        evaluated_latex += `\\big( ${expr.evaluate(scope).toFixed(4)} \\cdot ${p.uncer} \\big)^2`
    }
    general_latex += "}"
    evaluated_latex += "}"
    u_formula += ")^.5"

    // ========= | DISPLAY LATEX | ========
    latex = `${general_latex} = ${evaluated_latex} = ${math.evaluate(u_formula, scope).toFixed(4)}`

    tex_btn.value = latex // LaTeX is stored in this button's value so it could be copied by user
    tex.innerHTML = `\\[ ${latex} \\]`
    // tex[0].innerHTML = `\\[${general_latex}]\\`

    // rerender LaTeX on page
    MathJax.typesetPromise()

    // ========= | DISPLAY EXCEL | ========
    updateExcel(u_formula)
}

// Copy the LaTex inside of button 
copyLatex = () => { navigator.clipboard.writeText(tex_btn.value) }


