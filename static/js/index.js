formula_in.onchange = () => {
    params = params_in.value
    
    // ===== | GENERATE GENERAL FORMULA | =====
    latex = "u(y) = \\sqrt{"
    for(p of params) {

        derivative = math.derivative(formula_in.value, p).toTex()

        // skip and remove all non-contributing params 
        if(derivative == "0")  {
            params = params.replace(p, "")
            continue
        }

        // don't put '+' sign before the first part
        if(p != params[0])   latex += " + "

        latex += `\\Big(\\big(  ${derivative}  \\big)\\:  u(${p})  \\Big)^2`
        
    }
    latex += "}"
    
    tex_btn.value = latex
    tex.innerHTML = `\\[ ${latex} \\]`

    MathJax.typesetPromise()
}

// Copy the LaTex inside button 
tex_btn.onclick = () => { navigator.clipboard.writeText(tex_btn.value) }