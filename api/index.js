export const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

export async function getData() {
    await delay(3000);

    return { message: 'Hello', time: Date.now() };
}
