import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();

const mapTailSegments = [
  ...Array.from({ length: 10 }, (_, i) =>
    `scripts/master-assets-v4/map/part-08seg-${String(i).padStart(2, '0')}.b64`
  ),
  'scripts/master-assets-v4/map/part-08seg-10a.b64',
  'scripts/master-assets-v4/map/part-08seg-10b.b64',
  ...Array.from({ length: 8 }, (_, i) =>
    `scripts/master-assets-v4/map/part-08seg-${String(i + 11).padStart(2, '0')}.b64`
  ),
  'scripts/master-assets-v4/map/part-08ab.b64'
];

const assets = [
  {
    name: 'landing',
    parts: [
      'scripts/master-assets-v4/landing/part-00.b64',
      'scripts/master-assets-v4/landing/part-01aa.b64',
      'scripts/master-assets-v4/landing/part-01ab.b64',
      'scripts/master-assets-v4/landing/part-01b.b64',
      'scripts/master-assets-v4/landing/part-02.b64',
      'scripts/master-assets-v4/landing/part-03.b64'
    ],
    output: 'public/assets/master/landing-master-v4.avif',
    bytes: 27451,
    sha256: 'cb7a0196d05b6825e333d19f2a561c236e05d5924db56c28eede9ad6a5149acb'
  },
  {
    name: 'airport',
    parts: [
      'scripts/master-assets-v4/airport/part-00.b64',
      'scripts/master-assets-v4/airport/part-01.b64',
      'scripts/master-assets-v4/airport/part-02a.b64',
      'scripts/master-assets-v4/airport/part-02b.b64',
      'scripts/master-assets-v4/airport/part-03.b64'
    ],
    output: 'public/assets/master/airport-master-v4.avif',
    bytes: 29379,
    sha256: '1761be4082d61323aa37bb1762684472d899525304ab3c03b8aa18851a71c0b9'
  },
  {
    name: 'map',
    parts: [
      'scripts/master-assets-v4/map/part-00.b64',
      'scripts/master-assets-v4/map/part-01a.b64',
      'scripts/master-assets-v4/map/part-01b.b64',
      'scripts/master-assets-v4/map/part-02.b64',
      'scripts/master-assets-v4/map/part-03.b64',
      'scripts/master-assets-v4/map/part-04.b64',
      'scripts/master-assets-v4/map/part-05.b64',
      'scripts/master-assets-v4/map/part-06.b64',
      'scripts/master-assets-v4/map/part-07.b64',
      ...mapTailSegments
    ],
    output: 'public/assets/master/island-map-approved-v4.avif',
    bytes: 39458,
    sha256: '9b10e47094fe8c9e36ad05ea323d6d6a88c793621fbf87de880765fba79bd276'
  }
];

const verified = {};

for (const asset of assets) {
  const encoded = asset.parts
    .map((file) => {
      const absolute = path.join(root, file);
      if (!fs.existsSync(absolute)) {
        throw new Error(`[master-assets] Missing chunk: ${file}`);
      }
      return fs.readFileSync(absolute, 'utf8').trim();
    })
    .join('');

  const bytes = Buffer.from(encoded, 'base64');
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');

  if (bytes.length !== asset.bytes) {
    throw new Error(
      `[master-assets] ${asset.name} byte mismatch: expected ${asset.bytes}, got ${bytes.length}`
    );
  }

  if (sha256 !== asset.sha256) {
    throw new Error(
      `[master-assets] ${asset.name} sha256 mismatch: expected ${asset.sha256}, got ${sha256}`
    );
  }

  const output = path.join(root, asset.output);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, bytes);

  verified[asset.name] = {
    file: asset.output.replace(/^public\//, '/'),
    bytes: bytes.length,
    sha256
  };

  console.log(`[master-assets] verified ${asset.name}: ${bytes.length} bytes ${sha256}`);
}

const manifestPath = path.join(root, 'public/assets/master/manifest-v4.json');
fs.writeFileSync(
  manifestPath,
  JSON.stringify(
    {
      version: 'v4',
      generatedBy: 'scripts/materialize-master-assets.mjs',
      assets: verified
    },
    null,
    2
  ) + '\n'
);

console.log('[master-assets] all approved masters materialized and verified');
