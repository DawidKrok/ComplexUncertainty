// ================== | PARAMS | =================
class Param {
    constructor(n, v, u, c=false) {
        this.name = n
        this.value = v
        this.uncer = u
        this.is_const = c
    }
}

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
        if(n != "" && v != NaN && u != NaN) {  
            params.push(new Param(n, v, u, u == 0))
        }
    })

    return params
}

updateLatex()