async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'https://p8-xi.vercel.app',
        credentials: true,
    });

    // Render automatically sets process.env.PORT
    const port = process.env.PORT || 3000;
    
    // IMPORTANT: Bind to '0.0.0.0' for Render/Cloud environments
    await app.listen(port, '0.0.0.0'); 
    
    console.log(`Application is running on: ${await app.getUrl()}`);
}
