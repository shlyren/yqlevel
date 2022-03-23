import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 
 
// https://www.52pojie.cn/thread-1589961-1-1.html
    pom.xml
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
      <version>2.6.4</version>
    </dependency>

    <dependency>
      <groupId>com.alibaba</groupId>
      <artifactId>fastjson</artifactId>
      <version>1.2.79</version>
    </dependency>

 */
public class QYQuery {
    private static final String url = "http://103.66.32.242:8005/zwfwMovePortal/interface/interfaceJson";
    private static final RestTemplate restTemplate = new RestTemplate();
    private static final String nonceHeader = "123456789abcdefg";

    public static void main(String[] args) throws Exception {
        String timestamp = Long.valueOf(System.currentTimeMillis() / 1000).toString();
        String signatureHeaderStr = timestamp + "23y0ufFl5YxIyGrI8hWRUZmKkvtSjLQA" + nonceHeader + timestamp;
        String signatureHeader = getSHA256StrJava(signatureHeaderStr).toUpperCase();

        JSONObject payload = new JSONObject();
        payload.put("appId", "NcApplication");
        payload.put("paasHeader", "zdww");
        payload.put("key", "3C502C97ABDA40D0A60FBEE50FAAD1DA");
        payload.put("timestampHeader", timestamp);
        payload.put("nonceHeader", nonceHeader);
        payload.put("signatureHeader", signatureHeader);

        String signatureStr = timestamp + "fTN2pfuisxTavbTuYVSsNJHetwq5bJvCQkjjtiLM2dCratiA" + timestamp;
        String signature = getSHA256StrJava(signatureStr).toUpperCase();

        System.out.println("=============== Request Body ==========");
        System.out.println(JSON.toJSONString(
                payload,
                SerializerFeature.PrettyFormat,
                SerializerFeature.WriteMapNullValue,
                SerializerFeature.WriteDateUseDateFormat
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.add("x-wif-nonce", "QkjjtiLM2dCratiA");
        headers.add("x-wif-paasid", "smt-application");
        headers.add("x-wif-signature", signature);
        headers.add("x-wif-timestamp", timestamp);

        System.out.println("=============== Request headers ==========");
        System.out.println(JSON.toJSONString(
                headers,
                SerializerFeature.PrettyFormat,
                SerializerFeature.WriteMapNullValue,
                SerializerFeature.WriteDateUseDateFormat
        ));

        HttpEntity<JSONObject> formEntity = new HttpEntity<>(payload, headers);

        ResponseEntity<JSONObject> forEntity = restTemplate.postForEntity(url, formEntity, JSONObject.class);

        JSONObject object = forEntity.getBody();
        String pretty = JSON.toJSONString(
                object,
                SerializerFeature.PrettyFormat,
                SerializerFeature.WriteMapNullValue,
                SerializerFeature.WriteDateUseDateFormat
        );

        System.out.println("=============== Response JSON ==========");
        System.out.println(pretty);
    }

    /***
     * 利用java原生的摘要实现SHA256加密
     * @param str 加密后的报文
     * @return
     */
    public static String getSHA256StrJava(String str) throws NoSuchAlgorithmException {
        MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
        messageDigest.update(str.getBytes(StandardCharsets.UTF_8));
        return byte2Hex(messageDigest.digest());
    }
    /**
     * 将byte转为16进制
     * @param bytes
     * @return
     */
    private static String byte2Hex(byte[] bytes){
        StringBuilder stringBuffer = new StringBuilder();
        String temp;
        for (byte aByte : bytes) {
            temp = Integer.toHexString(aByte & 0xFF);
            if (temp.length() == 1) {
                //1得到一位的进行补0操作
                stringBuffer.append("0");
            }
            stringBuffer.append(temp);
        }
        return stringBuffer.toString();
    }
}
