module.exports = function check(str, bracketsConfig) {

  if(bracketsConfig) {
    const bc = new Map( // brackets as keys
      bracketsConfig.map(([open,close],index) => [
        [open, {type: open==close? 'a':'o', group: index}], // ambivalent or open
        [close, {type: open==close? 'a':'c', group: index}] // ambivalent or close
      ]).reduce((acc,v) => acc.concat(v), []) // flat arr
    );

    str = str.replace(/./g, c => {
      return `${bc.get(c).type}${bc.get(c).group}`
    });
  }

  // find closing bracket for first open bracket
  const findClosing = (str) => {
    let btype = str[0] == 'a' ? 'a' : 'c';
    let group = str[1];
    let skip = btype == 'a' ? 2 : 0;
    for(let i=0; i<str.length; i+=2){
      if(str[i+1] !== group)
        continue;
      if(str[i] == btype && --skip == 0)
        return i;
      else if(str[i] == 'o' && btype == 'c')
        skip++;
    }
    return -1;
  }

  if(str.length == 0)
    return true;

  if(str[0] == 'c') // string starts with close bracket
    return false;

  let closing_index = findClosing(str)
  if(closing_index == -1)
    return false;
  let inner_part = str.substring(2, closing_index);
  let next_part = str.substring(closing_index + 2);
  return check(inner_part, null) && check(next_part, null);

}
