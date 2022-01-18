const sourceMapSupport = require('source-map-support');
const callsites = require('callsites');





const callsitesArr = callsites();
for (const origTrace of callsitesArr) {
    const trace = sourceMapSupport.wrapCallSite(origTrace);
    console.log(trace.getFileName(), trace.getLineNumber(), trace.getColumnNumber(), trace.getFunctionName(), trace.getMethodName(), trace.getTypeName());
}