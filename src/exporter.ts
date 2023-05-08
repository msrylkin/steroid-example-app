import { SpanExporter, ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { ExportResult, ExportResultCode } from '@opentelemetry/core';

import axios from 'axios';
import { SteroidExportEntry, SteroidStackEntry } from './types';

// const url = 'http://localhost:3088/record'
const url = 'http://localhost:3088/dev/trace'
const root = process.cwd();
const token = 'example';
console.log('root', root);

interface CodePlaceable {
    fileName: string;
    lineNumber: number;
    columnNumber: number;
}

interface QueryItem extends CodePlaceable {
    measurements: [number, number][];
    callers: CodePlaceable[]
}

export class SteroidExporter implements SpanExporter {
    export2(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void {
        // console.log('spans', spans);
        const steroidSpans: ReadableSpan[] = spans.filter(span => !!span.attributes && span.attributes['steroid.trace']);
        const grouped: { [key: string]: SteroidExportEntry } = {};

        for (const span of steroidSpans) {
            const stackTrace: SteroidStackEntry[] = JSON.parse(span.attributes['steroid.trace'] as string);

            for (const stackEntry of stackTrace) {
                const key = `${stackEntry.fileName}:${stackEntry.lineNumber}:${stackEntry.columnNumber}`;

                if (!grouped[key]) {
                    grouped[key] = {
                        targetKey: key,
                        fileName: stackEntry.fileName,
                        lineNumber: stackEntry.lineNumber,
                        columnNumber: stackEntry.columnNumber,
                        measurements: []
                    };
                }

                grouped[key].measurements.push(span.duration);
            }
            console.log('duration', span.duration)
            console.log('start', span.startTime)
            console.log('end', span.endTime)
            console.log('diff', span.endTime[1] - span.startTime[1])
            console.log('==============================')
        }

        const result = Object.keys(grouped).map(key => grouped[key]);
        console.log('result', result);

        axios.post(url, { traces: result }, { headers: {
            token
        } }).then(() => resultCallback({ code: ExportResultCode.SUCCESS }));
    }
    export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void {
        const steroidSpans: ReadableSpan[] = spans.filter(span => !!span.attributes && span.attributes['steroid.trace']);
        const queries = [];

        for (const span of steroidSpans) {
            const [queryPlace, ...callerSpans]: SteroidStackEntry[] = JSON.parse(span.attributes['steroid.trace'] as string);
        
            let queryItem: QueryItem = queries.find(q => findEqualCodePlace(q, queryPlace));

            if (!queryItem) {
                queryItem = {
                    fileName: queryPlace.fileName,
                    lineNumber: queryPlace.lineNumber,
                    columnNumber: queryPlace.columnNumber,
                    measurements: [],
                    callers: [],
                };
                queries.push(queryItem);
            }

            queryItem.measurements.push(span.duration);

            for (const callerSpan of callerSpans) {
                let callerItem = queryItem.callers.find(c => findEqualCodePlace(c, callerSpan));

                if (!callerItem) {
                    queryItem.callers.push({
                        fileName: callerSpan.fileName,
                        lineNumber: callerSpan.lineNumber,
                        columnNumber: callerSpan.columnNumber,
                    });
                }
            }
        }

        for (const q of queries) {
            console.log('q', q);
        }

        axios.post(url, { queries }, { headers: {
            token
        } }).then(() => resultCallback({ code: ExportResultCode.SUCCESS }));
    }
    shutdown(): Promise<void> {
        return;
        // throw new Error('Method not implemented.');
    }

}

function findEqualCodePlace(a: CodePlaceable, b: CodePlaceable) {
    return a.fileName === b.fileName && a.lineNumber === b.lineNumber && a.columnNumber && b.columnNumber;
}