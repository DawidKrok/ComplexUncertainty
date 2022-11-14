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
formula_in.onchange = () => {
    params = get_params() 

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
        console.log(whole_expr, expr.evaluate(scope), p.uncer)
    }
    general_latex += "}"
    evaluated_latex += "}"
    

    // ========= | DISPLAY LATEX | ========
    latex =`${general_latex} = ${evaluated_latex} = ${ Math.sqrt(whole_expr).toFixed(4) }`

    tex_btn.value = latex
    tex.innerHTML = `\\[ ${ latex } \\]`

    MathJax.typesetPromise()
}

// Copy the LaTex inside of button 
tex_btn.onclick = () => { navigator.clipboard.writeText(tex_btn.value) }



// ================== | PARAMS | =================


// Add Param Card
param_add.onclick = () => {
    node = $("<div class='param_card'></div>")
    node.append('<input type="text" class="param_name">')
    node.append('<input type="number" class="param_value" value="1">')
    node.append('<input type="number" class="param_uncer" value="0.1">')    

    params_container.append(node[0])
}

// gets parameters' values from all Param Cards
get_params = () => {
    params = []
    
    $(".param_card").each((i, elem) => {
        n = $( elem ).find(".param_name").val()
        v = $( elem ).find(".param_value").val()
        u = $( elem ).find(".param_uncer").val()

        // add param only if all values are populated
        if(n != "" && v != "" && u != "") {  
            params.push(new Param(n, v, u))
        }
    })

    return params
}