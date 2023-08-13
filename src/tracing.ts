import * as opentelemetry from '@opentelemetry/sdk-node';
import * as sourceMapSupport from "source-map-support"
import { SteroidExporter, getSteroidInstrumentation } from 'steroid-otel-utils';

const projectRoot = process.cwd();

const steroidApiUrl = process.env.NODE_END === 'development' ? 'http://127.0.0.1:3088' : undefined;

const sdk = new opentelemetry.NodeSDK({
  autoDetectResources: true,
  traceExporter: new SteroidExporter({
    apiUrl: steroidApiUrl,
  }),
  instrumentations: [
    getSteroidInstrumentation({
      wrapCallSite: callSite => sourceMapSupport.wrapCallSite(callSite),
      projectPath: projectRoot,
    }),
  ]
});

sdk.start();
