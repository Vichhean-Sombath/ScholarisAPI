const createValidator = (schema) => (data) => {
    const result = schema.safeParse(data);

    if (result.success) {
        return {
            success: true,
            error: null,
            data: result.data
        };
    }

    return {
        success: false,
        error: [...new Set(result.error.issues.map((issue) => issue.message))],
        data: null
    };
};

module.exports = { createValidator };
