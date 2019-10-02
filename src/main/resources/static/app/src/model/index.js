import find from 'lodash/find';
import extend from 'lodash/extend';

export const getLink = (rel, links) => {
  return find(links, (link) => link.rel === rel);
};

export const resourceMatches = (a, b) => {
  let linkA = getLink('self', a.links);
  let linkB = getLink('self', b.links);
  if (linkA && linkB) {
    return linkA.href === linkB.href;
  }
  return false;
};

export const linkMatches = (a, b) => {
  if (a && b) {
    return a.href === b.href;
  }
  return false;
};

export const getLinkHref = (rel, links) => {
  let link = getLink(rel, links);
  return link ? link.href : null;
};

export class Resource {

  constructor(resource) {
    this.self = this.extractRel('self', resource);
    if (this.self && this.self.href) {
      this.id = this.extractId(this.self.href);
    }
    extend(this, resource);
  };

  extractRel = (rel, resource) => {
    if (resource && resource.links) {
      return find(resource.links, (link) => link.rel === rel);
    }
    return null;
  };

  // very opinionated but...
  extractId = (link) => link.substring(link.lastIndexOf('/') + 1, link.length);
}