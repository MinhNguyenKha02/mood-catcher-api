import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Mood Catcher API listening at http://localhost:${PORT}`);
});