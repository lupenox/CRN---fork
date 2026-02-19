try {
  await import('./routes/server.ts');
} catch(err) {
  console.error(err);
}