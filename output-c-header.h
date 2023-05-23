#ifndef _AUTOGEN_LORABUF_HEADER_FILE
#define _AUTOGEN_LORABUF_HEADER_FILE

typedef struct __attribute__((__packed__)) { 
    uint64_t some_one_bit_field:1;
    uint64_t some_two_bit_field:2;
    uint64_t some_eight_bit_field:8;
    uint64_t field:1;
    uint64_t names:2;
    uint64_t go:3;
    uint64_t after:1;
    uint64_t type_and_size:1;
} Uplink_UplinkMessageName_t;

typedef struct __attribute__((__packed__)) { 
    uint64_t test:15;
} Uplink_SecondUplinkName_t;

typedef struct __attribute__((__packed__)) { 
    uint64_t test:16;
} Uplink_ThirdUplinkName_t;

typedef struct __attribute__((__packed__)) { 
    uint64_t test:17;
} Uplink_FourthUplinkName_t;

typedef struct __attribute__((__packed__)) { 
    uint64_t some:1;
    uint64_t field:1;
    uint64_t name:2;
    uint64_t goes:3;
    uint64_t here:1;
} Downlink_DownlinkMessageName_t;

typedef struct __attribute__((__packed__)) { 
    uint64_t twelveBit:12;
    uint64_t value:13;
} Downlink_AnotherDownlink_t;

#endif