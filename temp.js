//  const timeoutId = {};
// const func = interval,iterations => {
//     timeoutId.id = setTimeout(innerFn, interval * 100, interval);   
// }

// const innerFn = delay, iterations => {
//     console.log(`Hello world. ${delay}`);

//     if (delay >= 5) return clearTimeout(timeoutId.id);
//     return func(delay + 1);
// }

// func(1)
const initialIterations = 5;
const func = (interval, iterations) => {
    const timeoutId = setTimeout(() => {
        console.log("Hello world.", interval/100);
        if (iterations <= 1){
            clearTimeout(timeoutId);
            console.log("\n")
            return func(interval + 100, initialIterations);
        }
        clearTimeout(timeoutId);
        return func(interval, iterations - 1);
    }, interval + 100)
}

func(100, initialIterations);