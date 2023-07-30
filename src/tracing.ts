import * as opentelemetry from '@opentelemetry/sdk-node';
import * as sourceMapSupport from "source-map-support"
import { SteroidExporter, getSteroidInstrumentation } from 'steroid-otel-utils';

const projectRoot = process.cwd();

const sdk = new opentelemetry.NodeSDK({
  autoDetectResources: true,
  traceExporter: new SteroidExporter(),
  instrumentations: [
    getSteroidInstrumentation({
      wrapCallSite: callSite => sourceMapSupport.wrapCallSite(callSite),
      projectPath: projectRoot,
    }),
  ]
});

sdk.start();
