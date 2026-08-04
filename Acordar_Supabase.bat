@echo off
echo ========================================================
echo Enviando comando para manter o banco de dados ativo...
echo ========================================================
echo.

curl -s -o NUL -w "Status da resposta: %%{http_code} (200 = OK!)" -H "apikey: sb_publishable_ujOgrDJiP7ITpMRtfYRfuw_WagffxIl" -H "Authorization: Bearer sb_publishable_ujOgrDJiP7ITpMRtfYRfuw_WagffxIl" "https://ibickxigovgcwwsqfpeb.supabase.co/rest/v1/songs?limit=1"

echo.
echo.
echo ========================================================
echo Concluido! O Supabase registrou a atividade.
echo Voce pode rodar este arquivo uma vez por semana
echo caso ninguem use o aplicativo nesse periodo.
echo ========================================================
echo.
pause
