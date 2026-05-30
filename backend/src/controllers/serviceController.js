const {
  createService,
  deactivateService,
  findActiveServiceById,
  findServiceById,
  findServiceByName,
  findServiceByNameExceptId,
  listActiveServices,
  updateService
} = require('../models/serviceModel');
const { createHttpError } = require('../utils/createHttpError');
const { trimmedString } = require('../validators/domainValidators');

function requestHasField(req, fieldName) {
  return Object.prototype.hasOwnProperty.call(req.body, fieldName);
}

function buildServicePayload(req) {
  return {
    name: trimmedString(req.body.name),
    duration: Number(req.body.duration),
    price: Number(req.body.price).toFixed(2)
  };
}

function buildServiceUpdateFields(req) {
  const fields = {};

  if (requestHasField(req, 'name')) {
    fields.name = trimmedString(req.body.name);
  }

  if (requestHasField(req, 'duration')) {
    fields.duration = Number(req.body.duration);
  }

  if (requestHasField(req, 'price')) {
    fields.price = Number(req.body.price).toFixed(2);
  }

  if (requestHasField(req, 'is_active')) {
    fields.isActive = req.body.is_active;
  }

  return fields;
}

async function findServiceNameConflict(name, serviceIdToIgnore) {
  let existingService = null;

  if (serviceIdToIgnore) {
    existingService = await findServiceByNameExceptId(name, serviceIdToIgnore);
  } else {
    existingService = await findServiceByName(name);
  }

  return existingService;
}

async function getServices(_req, res) {
  const services = await listActiveServices();

  return res.status(200).json({
    services
  });
}

async function getService(req, res, next) {
  const serviceId = Number(req.params.id);
  const service = await findActiveServiceById(serviceId);

  if (!service) {
    return next(createHttpError(404, 'Service not found'));
  }

  return res.status(200).json({
    service
  });
}

async function createManagedService(req, res, next) {
  const servicePayload = buildServicePayload(req);
  const nameConflict = await findServiceNameConflict(servicePayload.name, null);

  if (nameConflict) {
    return next(createHttpError(409, 'A service with this name already exists'));
  }

  const service = await createService(servicePayload);

  return res.status(201).json({
    service
  });
}

async function updateManagedService(req, res, next) {
  const serviceId = Number(req.params.id);
  const existingService = await findServiceById(serviceId);

  if (!existingService) {
    return next(createHttpError(404, 'Service not found'));
  }

  const fields = buildServiceUpdateFields(req);

  if (fields.name) {
    const nameConflict = await findServiceNameConflict(fields.name, serviceId);

    if (nameConflict) {
      return next(createHttpError(409, 'A service with this name already exists'));
    }
  }

  const service = await updateService(serviceId, fields);

  return res.status(200).json({
    service
  });
}

async function deactivateManagedService(req, res, next) {
  const serviceId = Number(req.params.id);
  const existingService = await findServiceById(serviceId);

  if (!existingService) {
    return next(createHttpError(404, 'Service not found'));
  }

  const service = await deactivateService(serviceId);

  return res.status(200).json({
    service
  });
}

module.exports = {
  createManagedService,
  deactivateManagedService,
  getService,
  getServices,
  updateManagedService
};
