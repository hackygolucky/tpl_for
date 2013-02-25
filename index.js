exports.module = tpl_for

//*** let users use {% for item in items reversed %}. Is the list of items reversed?

function tpl_for(parser, contents) { 
  var bits = contents.split(/\s+/)  // ["for", "item", "in", "items"]
    , contextTarget = bits[1]
    , lookupContextVariable = parser.lookup(bits[3]) 
    , forBody
    , emptyBody

  parser.parse({
  	// 'endfor' ends a loop within Django templates.
      'endfor': endfor
    , 'empty': empty
  })

  return function(context) {
    var target = lookupContextVariable(context)
      , output = []
      , loopContext

    if(!target || !target.length) {
      return emptyBody ? emptyBody(context) : ''
    }

    for(var i = 0, len = target.length; i < len; ++i) {
      loopContext = Object.create(context)
      loopContext[contextTarget] = target[i]
      loopContext.forloop = {
          parent: loopContext.forloop
        , index: i
        , isfirst: i === 0
        , islast: i === len - 1
        , length: len
      } 
      output.push(forBody(loopContext))   
    }

    return output.join('')
  }

  function empty(tpl) {
    forBody = tpl
    parser.parse({'endfor': endfor})
  }

  function endfor(tpl) {
    if(forBody) {
      emptyBody = tpl
    } else {
      forBody = tpl
    }
  }
}

// Loop over each item in an array. For example, to display a list of athletes provided in athlete_list:
// 	tags ==	{% for item in items %}
//  tags== 		<li>{% if item.okay %}it's okay{% else %}it's not okay{% endif %}</li>
// 	tags==	{% endfor %}

// variables ==	{{ message }}