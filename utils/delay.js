export default async function delay(func, ms) {
  await new Promise((resolve) => {
    setTimeout(() => {
      func()
      resolve();
    }, ms);
  });
}
