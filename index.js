exports.module = tpl_for

var parser = require('parser')
// allows for ({% for item in items reversed %}

function tpl_for(parser, contents) { 
  var bits = contents.split(/\s+/)  
    , contextTarget = bits[1] 
    , reverseTag = bits[3].reverse() 
    , lookupContextVariable = parser.lookup(bits[3]) 
    , forBody
    , emptyBody

  parser.parse({
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
      if (reverseTag) {
				loopContext[reverseTag[1]] = target[i]
      } else {
      	loopContext[contextTarget] = target[i]
      }
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