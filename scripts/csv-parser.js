class CSVParser extends EventTarget {
    /**
     * Create a CSVParser.
     * @param {string} url - URL to the CSV file.
     * @param {object} [options] - Parsing options.
     * @param {string} [options.delimiter=','] - Field delimiter.
     * @param {number} [options.batchSize=0] - Size of batches for row events (0 means no batching).
     */
    constructor(url, options = {}) {
        super();
        this.url = url;
        this.delimiter = options.delimiter || ',';
        this.headers = null;
        this.batchSize = options.batchSize || 0;
        this.dataBatch = [];
    }

    /**
     * Helper to dispatch custom events.
     * @param {string} eventName
     * @param {any} detail
     */
    _emit(eventName, detail) {
        this.dispatchEvent(new CustomEvent(eventName, { detail }));
    }

    /**
     * Start parsing the CSV file using fetch with streaming.
     */
    async parse() {
        try {
            const response = await fetch(this.url);
            if (!response.ok) {
                this._emit('error', new Error('Network response was not ok'));
                return;
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let remainder = '';
            let result;

            while (!(result = await reader.read()).done) {
                const chunk = decoder.decode(result.value, { stream: true });
                remainder += chunk;
                let newlineIndex;
                while ((newlineIndex = remainder.indexOf('\n')) !== -1) {
                    let line = remainder.slice(0, newlineIndex).replace(/\r$/, '');
                    remainder = remainder.slice(newlineIndex + 1);
                    this._processLine(line);
                }
            }
            if (remainder) {
                this._processLine(remainder);
            }
            if (this.batchSize > 0 && this.dataBatch.length > 0) {
                this._emit('data', this.dataBatch);
                this.dataBatch = [];
            }
            this._emit('end');
        } catch (err) {
            this._emit('error', err);
        }
    }

    /**
     * Process a single line of CSV.
     * @param {string} line - A line from the CSV file.
     */
    _processLine(line) {
        if (!line.trim()) return;
        const values = this.parseCSVLine(line, this.delimiter);
        if (!this.headers) {
            this.headers = values;
            this._emit('headers', this.headers);
        } else {
            const row = {};
            const len = this.headers.length;
            for (let i = 0; i < len; i++) {
                row[this.headers[i]] = i < values.length ? values[i] : null;
            }
            if (this.batchSize > 0) {
                this.dataBatch.push(row);
                if (this.dataBatch.length === this.batchSize) {
                    this._emit('data', this.dataBatch);
                    this.dataBatch = [];
                }
            } else {
                this._emit('data', row);
            }
        }
    }

    /**
     * Parse a CSV line into an array of values.
     * Handles quoted values and escaped quotes.
     * @param {string} line - A line from the CSV file.
     * @param {string} delimiter - Field delimiter.
     * @returns {string[]} Parsed values.
     */
    parseCSVLine(line, delimiter) {
        const tokens = [];
        let token = '';
        let inQuotes = false;
        const len = line.length;

        for (let i = 0; i < len; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && i + 1 < len && line[i + 1] === '"') {
                    token += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === delimiter && !inQuotes) {
                tokens.push(token);
                token = '';
            } else {
                token += char;
            }
        }
        tokens.push(token);
        return tokens;
    }
}