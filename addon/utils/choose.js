// TODO: probably don't need any more (see bag service)
export default function choose(arr) {
  let i = Math.floor(Math.random() * arr.length);
  return arr[i];
}
