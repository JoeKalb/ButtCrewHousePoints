async function test(){
  let response = await fetch(window.location.replace('display', 'houses'));
  let json = await response.json()
  console.log(json)
}

console.log("hello")
test()