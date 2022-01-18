// const opentelemetry = require("@opentelemetry/sdk-node");
import * as opentelemetry from '@opentelemetry/sdk-node';
import * as api from '@opentelemetry/api-metrics';
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import  { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
// const { registerInstrumentations } = require('@opentelemetry/instrumentation');
import { SequelizeInstrumentation } from 'opentelemetry-instrumentation-sequelize'
import { TypeormInstrumentation } from 'opentelemetry-instrumentation-typeorm';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import callsites, { CallSite } from 'callsites';
import * as sourceMapSupport from "source-map-support"
// const { MeterProvider, ConsoleMetricExporter } = require('@opentelemetry/metrics');
import { MeterProvider, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics-base';

import * as stackTrace from 'stack-trace';
import { trace } from '@opentelemetry/api';
import { SteroidExporter } from './exporter';

const projectRoot = process.cwd();

const sdk = new opentelemetry.NodeSDK({
  autoDetectResources: true,
  // metricExporter: new ConsoleMetricExporter(),
  // metricInterval: 500,
  // metricProcessor: 
  // traceExporter: new opentelemetry.tracing.ConsoleSpanExporter(),
  // traceExporter: new ZipkinExporter({
  //   url: 'http://localhost:9411/api/v2/spans'
  // }),
  traceExporter: new SteroidExporter(),
  // instrumentations: [getNodeAutoInstrumentations() as any],
  instrumentations: [
    getNodeAutoInstrumentations(),
    new SequelizeInstrumentation({
      // see under for available configuration
      // queryHook: (...args) => {
      //   console.log('query', args)
      // },
      // responseHook: (...args) => {
      //   console.log('response', args)
      // }
    }) as any,
    new TypeormInstrumentation({
      collectParameters: true,
      responseHook: (span) => {
        // var oldLimit = Error.stackTraceLimit;
        // Error.stackTraceLimit = Infinity;

        // const errTrace = new Error();

        // Error.stackTraceLimit = oldLimit;

        // const traces2 = stackTrace.parse(errTrace);
        const origTraces2 = callsites();
        const traces2: CallSite[] = origTraces2.map(orig => sourceMapSupport.wrapCallSite(orig));

        // console.log('===========')
        // for (const trace of traces2) {
        //   console.log(trace.getFileName(), trace.getLineNumber(), trace.getColumnNumber(), trace.getFunctionName(), trace.getMethodName(), trace.getTypeName())
        // }

        // console.log('===========')
        const results = [];
        traces2.shift();
        for (const trace of traces2) {
          if (isProjectFile(trace.getFileName())) {
            const fileName = trace.getFileName().replace(projectRoot, '');

            results.push({
              fileName,
              lineNumber: trace.getLineNumber(),
              columnNumber: trace.getColumnNumber(),
              functionName: trace.getFunctionName(),
            });
            // console.log(trace.getFileName(), trace.getLineNumber(), trace.getColumnNumber(), trace.getFunctionName(), trace.getMethodName(), trace.getTypeName());
          }
        }

        span.setAttribute('steroid.callee.filename', '');
        span.setAttribute('steroid.callee.line', '');
        span.setAttribute('steroid.callee.column', '');
        span.setAttribute('steroid.trace', JSON.stringify(results));
        // console.log('response: ', new Error().stack);
      }
    }),
  ]
});

function isProjectFile(fileName: string) {
  return !(/node_modules/.test(fileName)) && !(/(^internal)/.test(fileName));
}

sdk.start();
// .then(() => {
//   const meterProvider = api.metrics.getMeterProvider();
//   console.log('meterProvider', meterProvider)
//   const meter = meterProvider.getMeter('steroid-metrics');

//   console.log('meter', meter);
//   const asd = meter.createCounter('somefunction');

//   asd.add(123);
// });

// const meter = api.metrics.getMeterProvider().getMeter('steroid-metrics');

// console.log('meter', meter);
// const asd = meter.createValueRecorder('somefunction');

// asd.record(123);