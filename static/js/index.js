class Param {
    constructor(n, v, u) {
        this.name = n
        this.value = v
        this.uncer = u
    }
}


// ===== | GENERATE FORMULA | =====
formula_in.onchange = () => {
    params = get_params() 
    
    // ===== | GENERATE LATEX | =====
    latex = "u(y) = \\sqrt{"
    for(p of params) {

        derivative = math.derivative(formula_in.value, p.name).toTex()

        // skip and remove all non-contributing params
        if(derivative == "0")  {
            params = params.filter(par => par.name != p.name)
            continue
        }

        // don't put '+' sign before the first part
        if(p.name != params[0].name)   latex += " + "

        latex += `\\Big(\\big(  ${derivative}  \\big)\\:  u(${p.name})  \\Big)^2`
        
    }
    latex += "}"
    
    tex_btn.value = latex
    tex.innerHTML = `\\[ ${latex} \\]`

    MathJax.typesetPromise()
}

// Copy the LaTex inside of button 
tex_btn.onclick = () => { navigator.clipboard.writeText(tex_btn.value) }

// ===== | PARAMS | =====

// Add Param Card
param_add.onclick = () => {
    node = $("<div class='param_card'></div>")
    node.append('<input type="text" class="param_name">')
    node.append('<input type="number" class="param_value" value="1">')
    node.append('<input type="number" class="param_uncer" value="0.1">')    

    params_container.append(node[0])
}

get_params = () => {
    params = []
    
    $(".param_card").each((i, elem) => {
        n = $( elem ).find(".param_name").val()
        v = $( elem ).find(".param_value").val()
        u = $( elem ).find(".param_uncer").val()

        if(n != "" && v != "" && u != "") {  
            params.push(new Param(n, v, u))
        }
    })

    return params
}