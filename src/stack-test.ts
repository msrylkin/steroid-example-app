// const orig = Error.prepareStackTrace;
import callsites from 'callsites';
import * as sourceMapSupport from "source-map-support"


// import { getStackTrace } from 'get-stack-trace';

// Object.defineProperty(Error, 'prepareStackTrace', {
//     // value: Error.prepareStackTrace,
//     get: function () {
//         return function(err: Error, stackTraces: NodeJS.CallSite[]) {
//             console.log('args', stackTraces);
//             for (const trace of stackTraces) {
//                 console.log(trace.getFileName(), trace.getLineNumber(), trace.getColumnNumber(), trace.getFunctionName(), trace.getMethodName(), trace.getTypeName());
//             }
//             return orig.call(Error, err, stackTraces);
//             // return orig(...args);
//         }   
//     }
// });

(async function() {
    await (async () => null);
    // const stackTrace = await getStackTrace();



    
    const callsitesArr = callsites();
    for (const origTrace of callsitesArr) {
        const trace = sourceMapSupport.wrapCallSite(origTrace);
        console.log(trace.getFileName(), trace.getLineNumber(), trace.getColumnNumber(), trace.getFunctionName(), trace.getMethodName(), trace.getTypeName());
    }
    async function zxc() {
        await (async () => null);
        // console.log(new Error().stack);


        
        // console.log(stackTrace);
    }
    await zxc();
})();


