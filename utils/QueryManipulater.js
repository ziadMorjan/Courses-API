class QueryManipulater {
    constructor(model, req) {
        this.model = model;
        this.req = req;
        this.queryStr = JSON.stringify(req.query);
        this.queryObj;
        this.query;
    }

    filter() {
        if (this.queryStr.includes("$")) {
            this.queryObj = JSON.parse(this.queryStr);
        }
        else {
            this.queryStr = this.queryStr.replace(/(gte|gt|lte|lt)/, match => `$${match}`);
            this.queryObj = JSON.parse(this.queryStr);
        }
        ["sort", "fields", "page", "limit"].forEach((ele) => {
            if (this.queryObj[ele]) {
                delete this.queryObj[ele];
            }
        });
        this.query = this.model.find(this.queryObj);
        return this;
    }

    sort() {

        if (this.req.query.sort) {
            let sortBy = this.req.query.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort("createdAt");
        }
        return this;
    }

    limitFields() {
        if (this.req.query.fields) {
            let selectedFields = this.req.query.fields.split(",").join(" ");
            this.query = this.query.select(selectedFields);
        }
        else {
            this.query = this.query.select("-__v");
        }
        return this;
    }

    paginate() {
        let page = +this.req.query.page || 1;
        let limit = +this.req.query.limit || 5;
        let skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = QueryManipulater;